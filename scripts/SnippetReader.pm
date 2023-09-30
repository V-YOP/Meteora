#!/usr/bin/perl
use v5.36;
use YAML;
use Data::Dumper;
use JSON::PP;
use File::Find;
use lib '.';
use File::Spec::Functions qw/splitdir/;
use utf8;
use Encode;
use Encode::Locale;

sub test_md_text;

sub parse_markdown_snippet {
    $_ = shift;
    /^[\n\s]*((---|\+\+\+)?[\n\s]+|[\n\s]*)(.*)[\n\s]+(---|\+\+\+)[\n\s]+(.*)/s or die 'parse yaml header failed';
    my $yaml_header = $3;
    $_ = $5;
    s/\n\n\n/\n\n/sg;
    s/^[\n\s]*//;
    s/[\n\s]*$//;
    # /```[\n\s]*(\w+)[\n\s]+(.*?)[\n\s]*```[\n\s]+(.*)[\n\s]*$/s or die 'parse snippet and description failed';
    # my $lang = $1;
    # my $snippet = $2;
    # my $desc = $3;
    my @segments = split '---';
    my $header = Load $yaml_header;
    return {
        title  => $header->{title},
        tag => $header->{tag},
        segments => \@segments,
    }
}

sub read_snippets_dir {
    my ($path) = @_;
    chdir $path;
    my @results = ();
    find sub {
        $_ = decode 'locale', $_ foreach ($File::Find::dir, $_, $File::Find::name);
        return if not -T or not /\.md$/;
        my @dirs = splitdir $File::Find::dir;
        shift @dirs if $dirs[0] eq '.';
        # say "categories: [@{[join ', ', @dirs]}], parsing $File::Find::name ...";
        eval {
            open my $md_fh, '<:encoding(UTF-8)', $_ or die "read file failed";
            local $/ = undef;
            my $snippet = parse_markdown_snippet scalar <$md_fh>;
            $snippet->{categories} = \@dirs;
            push @results, $snippet;
        } or die "parse $File::Find::name failed: $@";
    }, '.';
    \@results;
}

my $json = JSON::PP->new->utf8->pretty->allow_nonref;
say $json->encode(read_snippets_dir $ARGV[0]);

# 输入Markdown文本，包含YAML头部
sub test_md_text {
    <<'MARKDOWN';
---
title: Sample Title
author: John Doe
date: 2023-09-26
tag:
    - FP
    - MVC
---

```perl
say 'hello!';
say 'hello!';
```

there is desc;
there is desc;
there is desc;
there is desc;
MARKDOWN
}
